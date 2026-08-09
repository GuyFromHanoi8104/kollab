import os
import pandas as pd
import weaviate
from pathlib import Path
# from docling.document_converter import DocumentConverter
from weaviate.classes.init import Auth
from weaviate.classes.config import Configure

from dotenv import load_dotenv
load_dotenv()

wcd_url = os.getenv("WEAVIATE_URL")
wcd_api_key = os.getenv("WEAVIATE_API_KEY")
openai_api_key = os.getenv("OPENAI_API_KEY")

def generate_chunks_and_metadata(file_path):
    source = Path(file_path)
    final_results = []
    
    # if source.suffix.lower() == '.csv':
    #     df = pd.read_csv(source)
    # elif source.suffix.lower() in ['.xlsx', '.xls']:
    #     df = pd.read_excel(source)
    # else:
    #     document_converter = DocumentConverter()
    #     converted_doc = document_converter.convert(source).document
    #     if converted_doc.tables:
    #         df = converted_doc.tables[0].to_dataframe()
    #     else:
    #         print("No tabular data found.")
    #         return []

    df = pd.read_csv(source) 
    df.columns = [str(col).strip() for col in df.columns]
        
    for index, row in df.iterrows():
        title = str(row.get("title", "")).strip()
        if not title or title.lower() == "nan":
            continue
            
        chunk_entry = {
            "row_id": str(row.get("show_id", f"s{index+1}")),
            "text": {
                "title": title,
                "director": str(row.get("director", "None")) if pd.notna(row.get("director")) else "None",
                "description": str(row.get("description", "")) if pd.notna(row.get("description")) else ""
            },
            "metadata": {
                "type": str(row.get("type", "None")) if pd.notna(row.get("type")) else "None",
                "country": str(row.get("country", "None")) if pd.notna(row.get("country")) else "None",
                "release_year": str(int(row["release_year"])) if pd.notna(row.get("release_year")) and isinstance(row["release_year"], (int, float)) else str(row.get("release_year", "None")),
                "listed_in": str(row.get("listed_in", "None")) if pd.notna(row.get("listed_in")) else "None",
            }
        }
        
        final_results.append(chunk_entry)

    for idx, chunk in enumerate(final_results):
        print(f"Chunk {idx + 1}:")
        print(f"Text: {chunk['text']}")
        print(f"Metadata: {chunk['metadata']}")
        print("-" * 50)

    return final_results

if __name__ == "__main__":
    file_path = "/srv/storage/talc3@storage4.nancy.grid5000.fr/multispeech/calcul/users/ptuannam/agentic-rag-recommendation-engine/sources/netflix_titles_sample.csv"
    data = generate_chunks_and_metadata(file_path)

    print("\nConnecting to Weaviate Cloud")
    client = weaviate.connect_to_weaviate_cloud(
        cluster_url=wcd_url,
        auth_credentials=Auth.api_key(wcd_api_key),
        headers={"X-Goog-Studio-Api-Key": openai_api_key},
    )
    
    try:
        is_ready = client.is_ready()
        print("client ready:", is_ready)  
        
        if is_ready:
            # if client.collections.exists("netflix_data_system_2"):
            #     print("Deleting existing collection to update config")
            #     client.collections.delete("netflix_data_system_2")

            print("Creating collection 'netflix_data_system_2' with Gemini")
                
            netflix_data = client.collections.create(
                name="netflix_data_system_2",
                vector_config=Configure.Vectors.text2vec_google_aistudio(
                    model_id="text-embedding-004",  
                ),
                generative_config=Configure.Generative.google(
                    project_id="dummy-project-id",  # Just to pass Python's validation
                    model_id="gemini-2.5-flash"
                ),
            )

            print("Starting dynamic batch vector insertion")
            with netflix_data.batch.dynamic() as batch:
                for d in data:
                    batch.add_object(
                        properties={
                            "title": d["text"]["title"],
                            "director": d["text"].get("director", "N/A"),
                            "description": d["text"].get("description", "N/A"),
                            "type": d["metadata"]["type"],
                            "country": d["metadata"]["country"],
                            "release_year": d["metadata"]["release_year"],
                            "listed_in": d["metadata"]["listed_in"],
                        }
                    )
            
            failed_objs = netflix_data.batch.failed_objects
            if failed_objs:
                print(f"Batch finished with errors. {len(failed_objs)} objects failed.")
                for obj in failed_objs[:3]:
                    print(f"Error: {obj.message}")
            else:
                print("Successfully added all documents to Weaviate!")
        else:
            print("Client is not ready. Check your WEAVIATE_URL or API keys.")
            
    finally:
        client.close()
        print("Weaviate client connection closed cleanly.")
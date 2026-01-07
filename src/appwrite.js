import { Query, Client, ID, Databases } from "appwrite";

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;
const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;

const client = new Client()
  .setEndpoint("https://fra.cloud.appwrite.io/v1")
  .setProject(PROJECT_ID);

const databases = new Databases(client);

export const updateSearchCount = async (searchTerm, movie) => {


  console.log("function called");

  try {
    const result = await databases.listDocuments({
  databaseId: DATABASE_ID,
  collectionId: COLLECTION_ID,
  queries: [Query.equal("searchTerm", searchTerm)],
});


    if (result.documents.length > 0) {
      const doc = result.documents[0];

      await databases.updateDocument(
        DATABASE_ID,
        COLLECTION_ID,
        doc.$id,
        {
          count: doc.count + 1,
        }
      );
    } else {
      await databases.createDocument(
        DATABASE_ID,
        COLLECTION_ID,
        ID.unique(),
        {
          searchTerm,
          count: 1,
          movie_id: movie.id,
          poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        }
      );
    }
  } catch (error) {
    console.error("Appwrite error:", error);
  }
};


export const getTrendingMovies=async()=>{
  try{
    const result=await databases.listDocuments(DATABASE_ID,COLLECTION_ID,[
      Query.limit(5),
      Query.orderDesc("count")
    ])
    return result.documents;
  }catch(error){
    
  }
}
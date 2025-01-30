export async function fetchReviews(){
    try{
        const response = await fetch("http://localhost:5000/reviews");
        if (!reposne.ok){
            throw new Error("Failed to fetch reviews");
        }
        return await response.json();
    }catch (error) {
        console.error("Error fetching reviews:", error);
        return [];
    }
}
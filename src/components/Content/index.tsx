import { useEffect, useState } from "react";

const Content = () => {
    const [ethPrice, setEthPrice] = useState(0);
    const [lastFetchTimestamp, setLastFetchTimestamp] = useState(0);
    const [queryString,setQueryString] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [imageURL, setImageURL] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            fetch("https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD")
            .then((data) => data.json())
            .then((data) => {
                setEthPrice(Math.round(Number(data.USD)));
                setQueryString(
                    encodeURIComponent(
                    `The year ${Math.round(Number(data.USD))}`));
                setLastFetchTimestamp(Date.now()/1000);
            })
            .catch((err) => console.log(err))
        };

        if ((Date.now()/1000  - lastFetchTimestamp) > 10) {
            console.log("pooling price API");
            fetchData();
        };
    },[lastFetchTimestamp]);

    useEffect(() => {
        const fetchData = async () => {
            fetch(`https://customsearch.googleapis.com/customsearch/v1?cx=${process.env.REACT_APP_CUSTOM_SEARCH_ENGINE_ID}&searchType=image&key=${process.env.REACT_APP_GOOGLE_IMG_API_KEY}&q=${queryString}&num=1`)
            .then((data) => data.json())
            .then((data) => {
                setImageURL(data.items[0].link);
                setIsLoading(false);
            })
            .catch((err) => console.log(err))
        };

        if (!isLoading && queryString.length > 0) {
            setIsLoading(true);
            fetchData();
        };
    }, [queryString, isLoading]);

    return (
        <>
        
         <div className="mx-auto w-fit text-xl text-white font-bold opacity-50">
             ONE IMAGE. EVERY TICK. UNTIL MY FREE TIER API KEY RUNS OUT.
         </div>

         <div className="mx-auto w-fit text-3xl text-white font-bold mt-6">
                ETH Price: ${ethPrice}
         </div>

         <div className="mx-auto w-fit text-xl text-white font-bold mt-9">
             <span className="font-medium opacity-50">Top Google image result for: </span> "The Year {ethPrice}"
         </div>

            <img src={imageURL} className="mx-auto mt-6" alt={`${ethPrice}`}/>

        </>
    );
};

export default Content;
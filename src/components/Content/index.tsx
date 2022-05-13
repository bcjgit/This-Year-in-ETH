import { useEffect, useState } from "react";

const Content = () => {
    const [ethPrice, setEthPrice] = useState(0);
    const [lastFetchTimestamp, setLastFetchTimestamp] = useState(0);
    const [queryString,setQueryString] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [imageURL, setImageURL] = useState("");
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            fetch("https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD")
            .then((data) => {
                if (data.status === 429) {
                    setIsError(true);
                }
            return data.json();
        })
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
            .then((data) => {
                if (data.status === 429) {
                    setIsError(true);
                }

                return data.json();
            }
            )
            .then((data) => {
                setImageURL(data.items[0].link);
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
         <div className="text-md font-medium text-white">
                 <span className="opacity-50">Created by </span> <a href="https://twitter.com/pbrianandj" className="text-white underline">@pbrianandj</a>
                 <span className="ml-2 opacity-50">Inspired by </span> <a href="https://twitter.com/punk4156" className="text-white underline">@punk4156</a>
        </div>
        
         <div className="mx-auto w-fit text-4xl text-white font-bold opacity-50">
             ONE IMAGE. EVERY TICK. UNTIL MY API KEY RUNS OUT.
         </div>

         <div className="mx-auto w-fit text-3xl text-white font-bold mt-6">
                ETH Price: ${ethPrice}
         </div>

         <div className="mx-auto w-fit text-xl text-white font-bold mt-9">
             <span className="font-medium opacity-50">Top Google image result for: </span> "The Year {ethPrice}"
         </div>

            {
                isError && (
                    <div className="mx-auto w-fit text-xl text-white font-bold opacity-70 mt-5">
                     🪦 Brian's API key ran out :( ... check back in a few minutes
                    </div>
                )
            }
            <img src={imageURL} className="mx-auto mt-6" alt={`${ethPrice}`}/>

            {/* <br/>
            <br/>
            <br/>
            <br/>
            <div className="border-t border-slate-50">
                This mayhem brought to you by <a href="https://twitter.com/pbrianandj" className="text-indigio-600 underline">@pbrianandj</a>
            </div> */}

        </>
    );
};

export default Content;
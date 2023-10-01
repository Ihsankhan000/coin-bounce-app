import { getNews } from '../../api/external';
import Loader from '../../components/Loader/Loader';
import styles from './Home.module.css';
import { useState,useEffect } from 'react';

function Home (){

    const [articles, setArticles] = useState([]);

    useEffect(() => {
        (async function newsApiCall(){
            const response = await getNews();
            setArticles(response);
        })();

        // cleanup function
         setArticles([]);
    }, [])
    
   const handleCardClick = (url) => {
     window.open(url, "_blank");
   }

     if( articles.length === 0){
        return <Loader  text="homepage"/>
     }

    return (
        <>
            <div className={styles.header}>Latest Articles</div>
            <div className={styles.grid}>
                {articles.map((article) => (
                       <div className={styles.card}  key={article.url} 
                       onClick={ () => handleCardClick(article.url)} > 
                       <img src={article.urlToImage} alt={article.title} />
                       <h3>{article.title}</h3>
                       </div> 
                    ))}
            </div>
        </>
    )
}

export default Home;






// import { getNews } from '../../api/external';
// import styles from './Home.module.css';
// import { useState, useEffect } from 'react';

// function Home() {
//   const [articles, setArticles] = useState([]);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     (async function newsApiCall() {
//       try {
//         const response = await getNews();
//         setArticles(response);
//       } catch (error) {
//         setError(error);
//       }
//     })();
//   }, []);

//   if (error) {
//     return <div>Error: {error.message}</div>;
//   }

//   return (
//     <>
//       <div className={styles.header}>Latest Articles</div>
//       <div className={styles.grid}>
//         {articles.map((article) => (
//           <div  className={styles.card} 
//           key={article.url} >
//             <img src={article.urlToImage} alt={article.title} />
//             <h3>{article.title}</h3>
//           </div>
//         ))}
//       </div>
//     </>
//   );
// }

// export default Home;

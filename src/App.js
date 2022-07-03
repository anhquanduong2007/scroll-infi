import './App.css';
import React, { useState } from "react";
import Loading from "./components/Loading";
function App() {
    const [movies,setMovies] = useState([]);
    const [totalPage,setTotalPage] = useState(0);
    const [pageNumber,setPageNumber] = useState(1);
    const [loading,setLoading] = useState(false);
    const fetchMovie = async (pageNumber) => {
        const res = await fetch(`https://quanphim.herokuapp.com/api/phimbo?_limit=20&_page=${pageNumber}`);
        const data = await res.json();
        const total = Math.ceil(data.pagination._totalRows / 20);
        setMovies(movie => [...movie,...data.data]);
        setTotalPage(total);
        setLoading(true);
    }
    React.useEffect(() => {
        fetchMovie(pageNumber);
    },[pageNumber]);
    const loadmore = () => {
        setPageNumber(prev => prev + 1);
    }
    const pageEnd = React.useRef();
    let num = 1;
    React.useEffect(() => {
        if(loading){
            const observer = new IntersectionObserver(entries => {
                console.log(entries[0]);
                if(entries[0].isIntersecting){
                    num++;
                    loadmore()
                    if(num > totalPage ){
                        observer.unobserve(pageEnd.current)
                    }
                }
            },{threshold: 1});
            observer.observe(pageEnd.current);  
        }
    },[loading,num,totalPage])
    return ( 
        <div className = "App">
            {
                movies.map((movie,index) => {
                    return (
                        <div className = "movies" key = {index}>
                            <img src = {movie.imageUrl} alt = ""/>
                            <p>{movie.title}</p>
                        </div>
                    )
                })
            }
            <div className = "loading">
                <Loading/>
            </div>
            <h3>{movies.length}</h3>
            <div ref = {pageEnd}></div>
        </div>
    );
}

export default App;
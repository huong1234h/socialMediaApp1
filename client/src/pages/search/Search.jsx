import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { useLocation } from "react-router-dom";
import { makeRequest } from "../../axios";
import SearchedUser from "../../components/searchedUser/SearchedUser";
import { AuthContext } from "../../context/authContext";
import "./search.scss"; // Import your search stylesheet
const Search = () => {
    const { currentUser } = useContext(AuthContext);
    //Get name from url for searching 
    const name = useLocation().pathname.split("/")[2];
    console.log(name);
    //Get user have name of user same name of path
    const { isLoading, error, data } = useQuery(["oUsers", name], () =>
    makeRequest.get(`/users/search/${name}`).then((res) => {
      return res.data;
    })
  );
  //Render data on search page
  const renderProfiles = () => {
    if (isLoading) {
      return <div>Loading...</div>;
    }

    if (error) {
      console.error("Error fetching data:", error);
      return <div>Error: Failed to load data.</div>;
    }

    if (!data || !data.length) {
      return <div>No results found.</div>;
    }
    // In case find out username same name of path
    return data.map((user,index) => {
      return <SearchedUser user={user} key={index}/>
    });
  };
  
  return (
    <div className="search">
      <div className="navSearch">

      </div>
      <article className="sUser">
        <main className="sUser__profiles">{renderProfiles()}</main>
        <div className="seeAll">
          <button>Xem tất cả</button>
        </div>
      </article>
      
    </div>
  );
};

export default Search;

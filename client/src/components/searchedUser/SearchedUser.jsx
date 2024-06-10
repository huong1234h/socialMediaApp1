import BtnFollow from "../btnFollow/BtnFollow";

const SearchedUser = ({ user }) => {
  return (
    <article className="sUser__profile">
      <img
        src={user.profilePic ? `${user.profilePic}` : "/upload/image.png"} // Handle missing image URLs
        alt={user.name}
        className="sUser__picture"
      />
      <span className="sUser__name">
        {user.name}
        <br />
        <span className="sUser_address">Live in Hà Nội</span>
      </span>

      <BtnFollow userId={user.id}/>
    </article>
  );
};

export default SearchedUser;

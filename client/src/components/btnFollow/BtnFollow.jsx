import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useContext } from "react";
import { makeRequest } from "../../axios";
import { AuthContext } from "../../context/authContext";
import { DarkModeContext } from "../../context/darkModeContext";

const BtnFollow = ({ userId}) => {
  const { currentUser } = useContext(AuthContext);
  const {darkMode} = useContext(DarkModeContext);
  const { isLoading: isRelationshipLoading, data: relationshipData } = useQuery(
    ["relationship", userId], // Include userId to refetch on user change
    async () => {
      const response = await makeRequest.get(
        `/relationships?followedUserId=${userId}`
      );
      return response.data;
    },
    {
      enabled: !!userId, // Only fetch data if userId is defined
    }
  );

  const queryClient = useQueryClient();

  const mutation = useMutation(
    async (following) => {
      if (following) {
        return makeRequest.delete(`/relationships?userId=${userId}`);
      }
      return makeRequest.post("/relationships", { userId });
    },
    {
      onSuccess: () => {
        // Invalidate and refetch relevant queries
        queryClient.invalidateQueries(["relationship", userId]); // Target specific user
        // Optionally, refetch other queries that depend on following state
      },
    }
  );
  const isFollowing = relationshipData?.includes(currentUser.id);
  const handleFollow = async () => {
    await mutation.mutateAsync(isFollowing); // Use mutateAsync for better error handling
  };

  return (
    <button onClick={handleFollow} className="btnFollow" style={!isFollowing ? {backgroundColor: 'hsl(255,85%,75%)',color:'#fff'} : (darkMode ? {backgroundColor: 'hsla(255,85%,90%,.2)',color:'#fff'} : {backgroundColor: 'hsl(255,20%,90%)',color:'hsl(255,50%,20%)'})}>
      {isFollowing ? "Đang theo dõi" : "Theo dõi"}
    </button>
  );
};

export default BtnFollow;

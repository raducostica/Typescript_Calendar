import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import Layout from "../components/Layout";

const Leaderboard: React.FC = () => {
  const { getUserPoints, allUserPoints, isLoading } = useContext(AuthContext);

  const [page, setPage] = useState<number>(1);

  useEffect(() => {
    getUserPoints(page);
  }, []);

  useEffect(() => {
    console.log(page);
    getUserPoints(page);
  }, [page]);

  const nextPage = () => {
    if (page < allUserPoints.users.length) {
      setPage(allUserPoints.next.page);
    }
  };

  const prevPage = () => {
    if (page < 1) {
      setPage(1);
    } else if (page > 1) {
      setPage(allUserPoints.prev.page);
      getUserPoints(page);
    }
  };

  return (
    <Layout>
      <div
        style={{
          background: "#fff",
          padding: "2.5rem",
          margin: "2rem 0",
          height: "100vh",
        }}
      >
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                justifyContent: "center",
                paddingBottom: "0.7rem",
              }}
            >
              <p style={{ fontSize: "1.4rem" }}>Rank</p>
              <p style={{ fontSize: "1.4rem" }}>Username</p>
              <p style={{ fontSize: "1.4rem" }}>Points</p>
            </div>
            {allUserPoints.users.map(
              (user: { username: string; points: number }, i: number) => {
                return (
                  <>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(3, 1fr)",
                        justifyContent: "center",
                        border: "1px dotted #333",
                      }}
                    >
                      <p
                        style={{
                          padding: "0.7rem",
                          borderRight: "1px dotted #333",
                        }}
                      >
                        {i + 1}
                      </p>
                      <p
                        style={{
                          padding: "0.7rem",
                          borderRight: "1px dotted #333",
                        }}
                      >
                        {user.username}
                      </p>
                      <p
                        style={{
                          padding: "0.7rem",
                        }}
                      >
                        {user.points}
                      </p>
                    </div>
                  </>
                );
              }
            )}
          </>
        )}
        <button onClick={() => nextPage()}>next</button>
        <button onClick={() => prevPage()}>prev</button>
      </div>
    </Layout>
  );
};

export default Leaderboard;

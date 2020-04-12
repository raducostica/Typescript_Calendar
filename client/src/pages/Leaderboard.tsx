import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import Layout from "../components/Layout";

import leaderboardStyles from "../styles/leaderboard.module.css";

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
    if (page <= allUserPoints.next.page) {
      setPage(page + 1);
    }
  };

  const prevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const changePage = () => {
    if (allUserPoints.previous && allUserPoints.next) {
      return (
        <>
          <button
            className={leaderboardStyles.btnBack}
            onClick={() => prevPage()}
          >
            prev
          </button>
          <button className={leaderboardStyles.btn} onClick={() => nextPage()}>
            next
          </button>
        </>
      );
    } else if (allUserPoints.next) {
      return (
        <button className={leaderboardStyles.btn} onClick={() => nextPage()}>
          next
        </button>
      );
    } else if (allUserPoints.previous) {
      return (
        <button
          className={leaderboardStyles.btnBack}
          onClick={() => prevPage()}
        >
          prev
        </button>
      );
    }
  };

  return (
    <Layout>
      <div className={leaderboardStyles.main}>
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
              (
                user: { username: string; points: number; row_number: number },
                i: number
              ) => {
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
                        {user.row_number}
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
            {changePage()}
          </>
        )}
      </div>
    </Layout>
  );
};

export default Leaderboard;

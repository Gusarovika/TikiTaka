import React, { useState, useEffect } from "react";
import firebase from "../../firebase";
import Loader from "../../components/UI/Loader2/Loader";
import classes from "./Rating.module.css";

const fairRating = (el) => {
  let coef;
  if (el.games < 5) {
    coef = 0.5;
  } else if (el.games >= 5 && el.games < 10) {
    coef = 0.8;
  } else if (el.games >= 10 && el.games < 25) {
    coef = 0.9;
  } else {
    coef = 1;
  }
  return Math.round(el.rightAnswers * coef);
};

function useUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = firebase
      .firestore()
      .collection("users")
      .onSnapshot((snapshot) => {
        const newTest = snapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .sort((a, b) => fairRating(b) - fairRating(a));

        setUsers(newTest);
        setLoading(false);
      });
    return () => unsubscribe();
  }, []);

  return { base: users, loading };
}

const Rating = () => {
  const { base, loading } = useUsers();

  return (
    <main className={classes.main}>
      <div className={classes.wrapper}>
        <h1 className={classes.title}>ТАБЛИЦА РЕЗУЛЬТАТОВ</h1>
        {loading ? (
          <Loader />
        ) : (
          <table className={classes.tableRating}>
            <thead>
              <tr className={classes.rowThead}>
                <td className={classes.tdHead}>РЕЙТИНГ</td>
                <td className={classes.tdHead}>ИМЯ</td>
                <td className={classes.tdHead}>ИГРЫ</td>
              </tr>
            </thead>
            <tbody>
              {base.length > 0 &&
                base.map((elem, index) => {
                  return (
                    <tr key={index}>
                      <td className={classes.tdBody}>
                        <div className={classes.round}>{fairRating(elem)}</div>
                      </td>
                      <td className={classes.tdBody}>
                        <div className={classes.iconLogoBox}></div>
                        {elem.userName
                          ? elem.userName
                          : elem.firstName || elem.email}
                      </td>
                      <td className={classes.tdBody}>{elem.games}</td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        )}
      </div>
    </main>
  );
};

export default Rating;

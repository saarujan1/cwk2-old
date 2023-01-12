import { useEffect, useState, useRef } from "react";
import TinderCard from "react-tinder-card";
import { useAppContext } from "../store/UniContext";
import { getAzure } from "../store/helpers";
import Panel from "../components/Panels/Panel";

const rejectIcon = require("../assets/icons/reject.svg").default as string;
const acceptIcon = require("../assets/icons/accept.svg").default as string;

const characters = [
  {
    name: "Cristiano Ronaldo",
    email: "test@gmail.com",
    phone: "0123456789",
    bio: "Man Utd Footballer",
    hobbies: "Dancing",
    age: "37",
  },
  {
    name: "Lionel Messi",
  },
  {
    name: "Neymar",
  },
  {
    name: "David Beckham",
  },
  {
    name: "Harry Maguire",
    email: "test12@gmail.com",
    phone: "775234234234",
    bio: "Ex Footballer",
    hobbies: "Singing",
    age: "28",
  },
];

export default function DiscoverView() {
  const [currentIndex, setCurrentIndex] = useState(characters.length - 1);
  const currentIndexRef = useRef(currentIndex);
  const [globalState, dispatch] = useAppContext();
  const [user, setUser] = useState(null);
  const [lastDirection, setLastDirection] = useState();

  const getUser = async () => {
    try {
      let promise = new Promise((resolve, reject) =>
        getAzure(resolve, "/api/updateAccount?", {
          username: globalState.user.id,
          password: globalState.password,
        })
      );
      let resp = (await promise) as any;
      if (resp.account) {
        setUser(resp.account);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  const updateMatches = async (matchedUserId) => {
    console.log(matchedUserId);
    try {
      let promise = new Promise((resolve, reject) =>
        getAzure(resolve, "/api/updateAccount?", {
          username: globalState.user.id,
          password: globalState.password,
        })
      );
      let resp = (await promise) as any;
      if (resp.account) {
        setUser(resp.account);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // console.log(user)

  const swiped = (direction, swipedUserId) => {
    if (direction === "right") {
      updateMatches(swipedUserId);
    }
  };
  const outOfFrame = (name) => {
    console.log(name + " left the screen!");
  };

  return (
    <>
      {/* <div className="d-flex flex-column h-100 align-items-center">
        <Panel
          height="h70"
          width="col-12"
          padding={3}
          className="d-flex justify-content-center"
        >
          <div className="card-container">
            {characters.map((character, index) => (
              <TinderCard
                ref={childRefs[index]}
                className="swipe"
                key={character.name}
                onSwipe={(dir) => swiped(dir, character.name, index)}
                onCardLeftScreen={() => outOfFrame(character.name, index)}
              >
                <div className="card">
                  <h3>{character.name}</h3>
                </div>
              </TinderCard>
            ))}
          </div>
        </Panel>
        <Panel
          height="h30"
          width="col-12"
          padding={3}
          className="d-flex justify-content-center"
        >
          <img
            onClick={() => swipe("left")}
            role="button"
            src={rejectIcon}
            alt={"Reject"}
            width="100"
            height="100"
            aria-label={"Reject"}
          />
          <img
            onClick={() => goBack()}
            role="button"
            src={undoIcon}
            alt={"Undo"}
            width="100"
            height="100"
            aria-label={"Undo"}
          />
          <img
            onClick={() => swipe("right")}
            role="button"
            src={acceptIcon}
            alt={"Accept"}
            width="100"
            height="100"
            aria-label={"Accept"}
          />
        </Panel>
      </div> */}

      <h1 className="pageTitle"> Discover</h1>
      <h3> Who would you like to match with today? </h3>
      <div className="card-container">
        {characters.map((character, index) => (
          <TinderCard
            className="swipe"
            key={character.name}
            onSwipe={(dir) => swiped(dir, character.name)}
            onCardLeftScreen={() => outOfFrame(character.name)}
          >
            <div className="card">
              <h3>{character.name}</h3>
              <div className="attributes">
                <p className="attribute-text"> {character.email}</p>
                <p className="attribute-text"> {character.bio}</p>
                <p className="attribute-text"> {character.hobbies}</p>
                <p className="attribute-text"> {character.age}</p>
              </div>
            </div>
          </TinderCard>
        ))}
      </div>
      <div className="buttons">
        <img
          onClick={() => swiped("left", "Cristiano Ronaldo")}
          role="button"
          src={rejectIcon}
          alt={"Reject"}
          width="70"
          height="70"
          aria-label={"Reject"}
        />
        <img
          onClick={() => swiped("right", "Harry Maguire")}
          role="button"
          src={acceptIcon}
          alt={"Accept"}
          width="70"
          height="70"
          aria-label={"Accept"}
        />
      </div>
    </>
  );
}

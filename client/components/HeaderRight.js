import React from "react";

const HeaderRight = ({ toggleShowMenu, showMenu, stravaLogout, currentUser }) => {
  const modalMenu = (
    <div id="menuModal">
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="http://www.github.com/sselfridge/mapper.bike"
      >
        View source on GitHub
      </a>
      <hr />
      <a href="mailto:Sam.Selfridge@gmail.com">Sam.Selfridge@gmail.com</a>
      <hr />
      <a href="" onClick={stravaLogout}>
        Logout
      </a>
    </div>
  );

  console.log("currentUser");
  console.log(currentUser);

  const profileLink = `https://www.strava.com/athletes/${currentUser.althleteId}`

  return (
    <div className={"headerRight"}>
      {currentUser && (
        <span className={"userInfo"}>
          <div>
            <a className="userName" href={profileLink} rel="noopener noreferrer" target="_blank">
              {currentUser.firstname} {currentUser.lastname}
            </a>
          </div>
          <img className={"userAvatar"} src={currentUser.avatar} />
        </span>
      )}
      <span onClick={toggleShowMenu} className="hamburger" />
      {showMenu && modalMenu}
    </div>
  );
};

export default HeaderRight;

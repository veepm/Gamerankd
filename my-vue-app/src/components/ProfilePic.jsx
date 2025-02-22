import classes from "./css/profilePic.module.css";
import { memo } from "react";

const getHashOfString = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  hash = Math.abs(hash);
  return hash;
};

const normalizeHash = (hash, min, max) => {
  return Math.floor((hash % (max - min)) + min);
};

const generateHSL = (name) => {
  const hash = getHashOfString(name);
  const h = normalizeHash(hash, 0, 360);
  const s = normalizeHash(hash, 50, 75);
  const l = normalizeHash(hash, 40, 50);
  return [h, s, l];
};

const HSLtoString = (hsl) => {
  return `hsl(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%)`;
};

const ProfilePic = ({ username, className }) => {
  return (
    <div
      className={`${classes.pic} ${className}`}
      style={{
        background: HSLtoString(generateHSL(username)),
      }}
    >
      {username.charAt(0)}
    </div>
  );
};

export default memo(ProfilePic);

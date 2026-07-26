import ImageKit from "imagekit";
import config from "@/lib/config";

const {
  env: {
    imagekit: { publicKey, privateKey, urlEndpoint },
  },
} = config;

const imagekit =
  publicKey && privateKey && urlEndpoint
    ? new ImageKit({ publicKey, privateKey, urlEndpoint })
    : null;

export default imagekit;

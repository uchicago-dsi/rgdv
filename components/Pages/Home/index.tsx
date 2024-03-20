import { HomeClient } from "./Client";
import { Renderer } from "./Renderer";

const Home = process.env.NODE_ENV === "development" ? HomeClient : Renderer;

export default Home;
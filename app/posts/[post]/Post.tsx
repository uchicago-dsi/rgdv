import IS_DEV from "utils/isDev";
import { PostClient } from "./Client";
import { PostRenderer } from "./Renderer";

export const Post = IS_DEV ? PostClient : PostRenderer;
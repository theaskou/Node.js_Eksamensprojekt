import { navigate } from "svelte-routing";
import { fetchPost } from "./fetchUtil";

export default async function logoutHandler() {
  await fetchPost("/logout");
  navigate("/");
}

<script>
  import Checklist from "./pages/Checklist.svelte";
  import CreateProfile from "./pages/CreateProfile.svelte";
  import Lists from "./pages/Lists.svelte";
  import LoginForm from "./lib/LoginForm.svelte";
  import SignUpForm from "./lib/SignUpForm.svelte";
  import { Router, Route } from "svelte-routing";
  import ProtectedRoute from "./lib/ProtectedRoute.svelte";
  import { SvelteToast } from "@zerodevx/svelte-toast";

  let displaySignUp = $state(true);
</script>

<SvelteToast />

<Router>
  <main class="m-4 max-w-[375px] relative">
    <Route path="/">
      <div class="auth-forms">
        <fieldset class="auth-switcher">
          <label
            >Sign up
            <input
              type="radio"
              name="form-selector"
              value={true}
              bind:group={displaySignUp}
            />
          </label>
          <label
            >Log in
            <input
              type="radio"
              name="form-selector"
              value={false}
              bind:group={displaySignUp}
            />
          </label>
        </fieldset>
        {#if displaySignUp}
          <SignUpForm />
        {:else}
          <LoginForm />
        {/if}
      </div>
    </Route>
    <Route path="/lists">
      <ProtectedRoute let:user>
        <Lists {user} />
      </ProtectedRoute>
    </Route>
    <Route path="/lists/:id" let:params>
      <ProtectedRoute let:user>
        <Checklist {user} listId={params.id} />
      </ProtectedRoute>
    </Route>
  </main>
</Router>

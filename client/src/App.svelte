<script>
  import Checklist from "./pages/Checklist.svelte";
  import CreateProfile from "./lib/AvatarPicker.svelte";
  import Lists from "./pages/Lists.svelte";
  import LoginForm from "./pages/LoginForm.svelte";
  import SignUpForm from "./pages/SignUpForm.svelte";
  import { Router, Route } from "svelte-routing";
  import ProtectedRoute from "./lib/ProtectedRoute.svelte";
  import { SvelteToast } from "@zerodevx/svelte-toast";
  import EmailVerified from "./pages/EmailVerified.svelte";
  import InvitationAccepted from "./pages/InvitationAccepted.svelte";
  import ProfileSettings from "./pages/ProfileSettings.svelte";

  let displaySignUp = $state(true);
</script>

<SvelteToast />

<Router>
  <main class="m-4 max-w-[375px] relative">
    <Route path="/">
      <div>
        <fieldset class="flex">
          <label
            class="has-checked:bg-stone-100 w-full text-center py-3 font-semibold rounded-t-xl"
            >Sign up
            <input
              class="appearance-none"
              type="radio"
              name="form-selector"
              value={true}
              bind:group={displaySignUp}
            />
          </label>
          <label
            class="has-checked:bg-stone-100 w-full text-center py-3 font-semibold rounded-t-xl"
            >Log in
            <input
              class="appearance-none"
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
    <Route path="/profile">
      <ProtectedRoute let:user>
        <ProfileSettings {user} />
      </ProtectedRoute>
    </Route>
    <Route path="/verify">
      <EmailVerified />
    </Route>
    <Route path="/acceptinvitation">
      <InvitationAccepted />
    </Route>
  </main>
</Router>

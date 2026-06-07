<script>
  import Avatar from "../lib/Avatar.svelte";
  import { resolveColor } from "../lib/config/colors.js";

  let { currentListMembers, onlineMemberIds } = $props();
</script>

<ul class="flex gap-5">
  {#each $currentListMembers.members as member}
    <li>
      <div class="relative w-fit">
        <Avatar
          avatar={member.avatar}
          color={resolveColor(member.color)}
          size={40}
        />
        {#if $onlineMemberIds.includes(member.memberId)}
          <div
            class="absolute -right-px -bottom-px border border-white bg-green-600 rounded-full w-2.5 h-2.5"
          ></div>
        {/if}
      </div>
      <div>
        {member.userName}
      </div>
    </li>
  {/each}
</ul>

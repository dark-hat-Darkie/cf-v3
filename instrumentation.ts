/**
 * Runs once at server startup. We use it to fix a WSL2 dev-only issue where
 * Neon's DNS returns AAAA records but the WSL2 IPv6 stack is unreachable, and
 * Node 20's "Happy Eyeballs" hangs on the v6 socket. Forcing undici's
 * connection family to IPv4 sidesteps it. Safe in production (Vercel routes
 * Neon traffic over IPv4 anyway).
 */
export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  const forceIpv4 =
    process.env.FORCE_IPV4 === "1" || // explicit opt-in
    Boolean(process.env.WSL_DISTRO_NAME) || // running inside WSL
    Boolean(process.env.WSL_INTEROP); // older WSL detection
  if (!forceIpv4) return;

  try {
    const { Agent, setGlobalDispatcher } = await import("undici");
    setGlobalDispatcher(new Agent({ connect: { family: 4 } as never }));
  } catch {
    // undici may not be present in non-Node runtimes; silently skip.
  }
}

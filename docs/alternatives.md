# Bilt Alternatives

In which Bilt alternatives are named, and an exploration of why Bilt is different than the others
is done.

> Note: I have tried these tools a bit, but not extensively, so I may be totally off on their
> capabilities. I'd love if somebody that used these tools can correct me.

## Lerna

[Lerna](https://github.com/lerna/lerna): the most popular monorepo tool out there. It leans
on "Yarn workspaces" to enable the different packages to share dependencies
between them, and thus makes `npm link`-ing them together easier in more cases (although
not all of them!). Above that linking capability, it gives a series of command
that are executed, batch style, on _all_ the packages in your monorepo.

So in Lerna, you can do stuff like running a build, or publishing the packages on all the packages,
but it isn't really interested in the dependency graph between the packages.

Lerna is great for a small set of packages that are deeply connected with one another (think
all packages in the [babel](https://babeljs.io/) project), but only if you are OK with building
and testing _all_ packages at once.

Bilt was designed to treat each package as a totally independent
entity, while understanding the relationships between the packages. This enables
Bilt to scale to hundreds of packages in a repo, spanning multiple projects.

## Nx

According to the Nx [website](https://nx.dev), "Nx [...] analyzes your workspace
and figures out what can be affected by every code change.
That's why Nx doesn't rebuild and retest everything on every commit--
it only rebuilds what is necessary. Nx also uses a distributed computation cache.
If someone has already built or tested similar code,
Nx will use their results to speed up the command for everyone else instead
of rebuilding or retesting the code from scratch.
This, in combination with Nx’s support for distributed and incremental builds,
can help teams see up to 10x reduction in build and test times."

While this sounds perfect, the cost of this is that Nx deeply understands your codebase. So it
needs to understand whether your codebase is Angular, React, Vue, Node, or whatever, as it has
plugins for each and every one of them.

Bilt doesn't care what is in your package, as long as the steps needed to build them are defined.

## Bazel

[Bazel](https://bazel.build/), from Google, is supposed to be similar to the internal tool
Google have for building their monorepo. It is a veritable workhorse, and a super powerful tool
for dealing with repos of thousands (and probably tens of thousands) of packages, spanning
multiple packages.

But configuring your project to use Bazel is a complicated thing. I couldn't make
heads or tails on how to do it. The reason for this is its
extreme flexibility, which comes at the cost of configuration and understanding.

Bilt gives similar capabilities, but relies on NPM's `package.json` and
appraoch to publishing NPM packages, to give it the capability to handle repos
of hundreds of packages.

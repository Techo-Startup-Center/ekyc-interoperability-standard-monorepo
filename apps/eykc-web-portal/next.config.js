/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  redirects: async () => {
    return [
      {
        source: "/",
        destination: "/register",
        permanent: true,
      },
    ]
  }
}

module.exports = nextConfig

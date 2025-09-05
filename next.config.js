    /** @type {import('next').NextConfig} */
    const nextConfig = {
		typescript: {
		  ignoreBuildErrors: true,
		},
		eslint: {
			ignoreDuringBuilds: true,
		},
			env: {
		API_URL: process.env.API_URL,
		NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || 'http://localhost:5000/api',
	},
	  };
	  module.exports = nextConfig;

module.exports = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://codesense-backend.onrender.com/api/:path*'
      }
    ]
  }
}

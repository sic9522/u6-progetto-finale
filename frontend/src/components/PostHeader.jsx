function PostHeader({ username }) {
  return (
    <div className="d-flex align-items-center gap-2 px-3 pt-3 pb-2">
      <div
        className="rounded-circle avatar-circle text-white d-flex align-items-center justify-content-center flex-shrink-0"
        style={{ width: 40, height: 40, fontWeight: 600 }}
      >
        {username.charAt(0).toUpperCase()}
      </div>
      <span className="fw-semibold">{username}</span>
    </div>
  )
}

export default PostHeader

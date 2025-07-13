
export default function MessageBubble({ message, currentUser, onReact }) {
  const isImage = message.type === 'image';

  return (
    <div className={`mb-2 ${message.sender?._id === currentUser ? 'text-right' : 'text-left'}`}>
      <div className="inline-block p-2 bg-white shadow rounded max-w-[70%]">
        <strong>{message.sender?.username}</strong>
        {isImage ? (
          <img src={message.content} alt="shared" className="w-60 h-auto rounded my-2" />
        ) : (
          <p>{message.content}</p>
        )}

        {/* Reactions */}
        {message.reactions?.length > 0 && (
          <div className="text-sm mt-1">
            {message.reactions.map((r, i) => (
              <span key={i} className="mr-1">{r.emoji}</span>
            ))}
          </div>
        )}

        {/* Read Receipts */}
        {message.readBy?.length > 0 && (
          <div className="text-xs text-gray-600">
            Seen by {message.readBy.map((r) => r.username).join(', ')}
          </div>
        )}
      </div>

      {/* Reactions Buttons */}
      <div className="text-xs mt-1 space-x-1">
        <button onClick={() => onReact(message._id, '❤️')}>❤️</button>
        <button onClick={() => onReact(message._id, '👍')}>👍</button>
      </div>
    </div>
  );
}

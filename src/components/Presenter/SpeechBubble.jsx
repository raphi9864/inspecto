export default function SpeechBubble({ textRef }) {
  return (
    <div className="speech-bubble">
      <p id="avatar-text" ref={textRef}></p>
    </div>
  )
}

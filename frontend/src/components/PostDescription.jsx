import { useEffect, useRef, useState } from 'react'

function PostDescription({ text }) {
  const textRef = useRef(null)
  const [expanded, setExpanded] = useState(false)
  const [truncated, setTruncated] = useState(false)

  // Il clamp CSS taglia visivamente a 2 righe: si confronta l'altezza reale del testo
  // con quella visibile per sapere se c'e' davvero altro da mostrare.
  useEffect(() => {
    if (textRef.current) {
      setTruncated(textRef.current.scrollHeight > textRef.current.clientHeight + 1)
    }
  }, [text])

  return (
    <div>
      <h3 className="h6 mb-1">Descrizione</h3>
      <div className="position-relative post-description">
        <p ref={textRef} className={`mb-0 small ${expanded ? '' : 'post-description-clamp'}`}>
          {text}
        </p>
        {truncated && !expanded && (
          <button type="button" className="post-description-more" onClick={() => setExpanded(true)}>
            Mostra altro
          </button>
        )}
      </div>
    </div>
  )
}

export default PostDescription

import { useEffect, useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowCircleRight, faCircleArrowLeft } from '@fortawesome/free-solid-svg-icons'

const PdfPreview = ({ artifact }) => {
  const [numPages, setNumPages] = useState(0)
  const [pageNumber, setPageNumber] = useState(1)
  const enableBackward = pageNumber > 1
  const enableForward = pageNumber < numPages

  const backwardStyles = enableBackward ? { cursor: 'pointer' } : { opacity: 0.5, cursor: 'auto' }
  const forwardStyles = enableForward ? { cursor: 'pointer' } : { opacity: 0.5, cursor: 'auto' }

  const handlePackBackward = () => pageNumber > 1 && setPageNumber(pageNumber - 1)
  const handlePageForward = () => pageNumber < numPages && setPageNumber(pageNumber + 1)

  useEffect(() => {
    pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`
  }, [])

  return artifact ? (
    <div
      className="text-center p-5 ml-5"
      style={{ width: 600, border: 'solid 1px grey', borderRadius: '10%' }}>
      <h4>Previous Submission:</h4>
      <Document file={artifact} onLoadSuccess={({ numPages }) => setNumPages(numPages)}>
        {' '}
        <Page pageNumber={pageNumber} width={500} />
      </Document>
      <div className="mt-3">
        <FontAwesomeIcon
          role="button"
          className="mr-3"
          icon={faCircleArrowLeft}
          size="2xl"
          style={backwardStyles}
          onClick={handlePackBackward}
        />
        <span>{` ${pageNumber} of ${numPages}`}</span>
        <FontAwesomeIcon
          role="button"
          className="ml-3"
          icon={faArrowCircleRight}
          size="2xl"
          style={forwardStyles}
          onClick={handlePageForward}
        />
      </div>
    </div>
  ) : null
}

export default PdfPreview

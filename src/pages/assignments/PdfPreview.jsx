import { useEffect, useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import { RightCircleFilled, LeftCircleFilled } from '@ant-design/icons'

const PdfPreview = ({ artifact }) => {
  const { file_path } = artifact
  const [numPages, setNumPages] = useState(0)
  const [pageNumber, setPageNumber] = useState(1)
  const enableBackward = pageNumber > 1
  const enableForward = pageNumber < numPages

  const backwardStyles = enableBackward
    ? { cursor: 'pointer', fontSize: 20 }
    : { opacity: 0.5, cursor: 'auto', fontSize: 20 }
  const forwardStyles = enableForward
    ? { cursor: 'pointer', fontSize: 20 }
    : { opacity: 0.5, cursor: 'auto', fontSize: 20 }

  const handlePackBackward = () => pageNumber > 1 && setPageNumber(pageNumber - 1)
  const handlePageForward = () => pageNumber < numPages && setPageNumber(pageNumber + 1)

  useEffect(() => {
    pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`
  }, [])
  return (
    <div
      className="text-center p-5 ml-5"
      style={{ width: 600, border: 'solid 1px grey', borderRadius: '10%' }}>
      <h4>Previous Submission:</h4>
      <Document file={file_path} onLoadSuccess={({ numPages }) => setNumPages(numPages)}>
        {' '}
        <Page pageNumber={pageNumber} width={500} />
      </Document>
      <div className="mt-3">
        <LeftCircleFilled
          style={backwardStyles}
          role="button"
          className="mr-3"
          onClick={handlePackBackward}
        />
        <span>{` ${pageNumber} of ${numPages}`}</span>
        <RightCircleFilled
          style={forwardStyles}
          role="button"
          className="ml-3"
          onClick={handlePageForward}
        />
      </div>
    </div>
  )
}

export default PdfPreview

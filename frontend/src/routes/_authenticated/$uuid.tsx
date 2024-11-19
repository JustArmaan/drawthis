import { allQrCodeQueryOptions } from '@/query'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { QRCode } from '@/components/qr-code'

export const Route = createFileRoute('/_authenticated/$uuid')({
  component: RouteComponent,
})

function RouteComponent() {
  const { uuid } = Route.useParams()

  const { isPending, error, data } = useQuery(allQrCodeQueryOptions)

  if (isPending) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  const qrCode = data?.qrCodes.find((qrCode) => qrCode.id === uuid)

  if (!qrCode) return <div>QR Code not found</div>

  return (
    <div>
      <p>{qrCode.url}</p>
      <QRCode url={qrCode.url} />
    </div>
  )
}

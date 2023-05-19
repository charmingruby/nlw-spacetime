import { randomUUID } from 'crypto'
import { extname, resolve } from 'path'
import { createWriteStream } from 'fs'
import { pipeline } from 'stream'
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { promisify } from 'util'

const pump = promisify(pipeline)

export async function uploadRoutes(app: FastifyInstance) {
  app.post('/uploads', async (request: FastifyRequest, reply: FastifyReply) => {
    const upload = await request.file({
      limits: {
        fileSize: 5_242_880,
      },
    })

    if (!upload) {
      return reply.status(400).send()
    }

    const mimeTypeRegex = /^(image|video)\/[a-zA-Z]+/

    const isValidFileFormat = mimeTypeRegex.test(upload.mimetype)

    if (!isValidFileFormat) {
      return reply.status(400).send()
    }

    const fileId = randomUUID()
    const extension = extname(upload.filename)

    const fileName = fileId.concat(extension)

    const writeStream = createWriteStream(
      resolve(__dirname, '../../uploads/', fileName),
    )

    await pump(upload.file, writeStream)

    const fullUrl = request.protocol.concat('//').concat(request.hostname)
    const fileUrl = fullUrl.concat('/uploads/').concat(fileName).toString()

    return { fileUrl }
  })
}

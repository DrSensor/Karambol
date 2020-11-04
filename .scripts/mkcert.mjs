#!/usr/bin/env node

import mkcert from 'mkcert'
import { promises } from 'fs'
const { writeFile } = promises

const
  validityDays = 365,

  // create a certificate authority (same default with mkcert cli)
  { key: caKey, cert: caCert } = await mkcert.createCA({
    validityDays,
    organization: 'Test CA',
    countryCode: 'US',
    state: 'California',
    locality: 'San Francisco',
  }),

  // then create a tls certificate
  cert = await mkcert.createCert({
    caKey, caCert, validityDays,
    domains: ['127.0.0.1', 'localhost'],
  })

writeFile('snowpack.key', cert.key)
writeFile('snowpack.crt', cert.cert)

/* eslint-disable no-nested-ternary */
import fs from 'fs'
import { compile } from 'json-schema-to-typescript'

import loadConfig from '../config/load'
import { configToJSONSchema } from '../utilities/configToJSONSchema'
import Logger from '../utilities/logger'

export async function generateTypes(): Promise<void> {
  const logger = Logger()
  const config = await loadConfig()
  const outputFile = process.env.PAYLOAD_TS_OUTPUT_PATH || config.typescript.outputFile

  logger.info('Compiling TS types for Collections and Globals...')

  const jsonSchema = configToJSONSchema(config)

  compile(jsonSchema, 'Config', {
    bannerComment:
      '/* tslint:disable */\n/* eslint-disable */\n/**\n* This file was automatically generated by Payload.\n* DO NOT MODIFY IT BY HAND. Instead, modify your source Payload config,\n* and re-run `payload generate:types` to regenerate this file.\n*/',
    style: {
      singleQuote: true,
    },
  }).then((compiled) => {
    fs.writeFileSync(outputFile, compiled)
    logger.info(`Types written to ${outputFile}`)
  })
}

// when generateTypes.js is launched directly
if (module.id === require.main.id) {
  generateTypes()
}

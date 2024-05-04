import fs from 'node:fs'
import os from 'node:os'
import { spawn } from 'node:child_process'

(async () => {
  console.log('[node-libsamplerate] Welcome. This script will prepare the project for use.')

  console.log('[node-libsamplerate] Checking whether or not libsamplerate has been built')

  const buildExists = fs.existsSync('deps/libsamplerate/build')

  if (!buildExists) {
    console.log('[node-libsamplerate] Build directory not found. Building libsamplerate...')

    console.log('[node-libsamplerate] Creating build directory...')

    try {
      fs.mkdirSync('deps/libsamplerate/build', { recursive: true })
    } catch (err) {
      console.error(`[node-libsamplerate] Error creating build directory: ${err.message}`)

      process.exit(1)
    }

    console.log('[node-libsamplerate] Build directory created. Entering in it...')

    try {
      process.chdir('deps/libsamplerate/build')
    } catch (err) {
      console.error(`[node-libsamplerate] Error entering build directory: ${err.message}`)

      process.exit(1)
    }

    console.log('[node-libsamplerate] Entered in build directory. Running cmake...')

    await new Promise((resolve,) => {
      const cmake = spawn('cmake', [ '-DCMAKE_BUILD_TYPE=Release', '..' ])

      cmake.stdout.on('data', (data) => console.log(`[node-libsamplerate:cmake] ${data.toString()}`))
      cmake.stderr.on('data', (data) => console.error(`[node-libsamplerate:cmake] ${data.toString()}`))

      cmake.on('close', (code) => {
        if (code === 0) resolve()
        else {
          console.error(`[node-libsamplerate:cmake] cmake exited with code ${code}`)

          process.exit(1)
        }
      })
    })

    console.log('[node-libsamplerate] cmake ran successfully. Running make...')

    await new Promise((resolve) => {
      const make = spawn('make', [ `-j${os.cpus().length}` ])

      make.stdout.on('data', (data) => console.log(`[node-libsamplerate:make] ${data.toString()}`))
      make.stderr.on('data', (data) => console.error(`[node-libsamplerate:make] ${data.toString()}`))

      make.on('close', (code) => {
        if (code === 0) resolve()
        else {
          console.error(`[node-libsamplerate:make] make exited with code ${code}`)

          process.exit(1)
        }
      })
    })

    console.log('[node-libsamplerate] make ran successfully. Returning to project root...')

    try {
      process.chdir('../../..')
    } catch (err) {
      console.error(`[node-libsamplerate] Error returning to project root: ${err.message}`)

      process.exit(1)
    }

    console.log('[node-libsamplerate] Returned to project root. Building the binding with make...')
  } else {
    console.log('[node-libsamplerate] Build directory found. Supossing libsamplerate has been already built somehow. Building the binding with make...')
  }

  await new Promise((resolve) => {
    const make = spawn('make', [ `-j${os.cpus().length}` ])

    make.stdout.on('data', (data) => console.log(`[node-libsamplerate:make] ${data.toString()}`))
    make.stderr.on('data', (data) => console.error(`[node-libsamplerate:make] ${data.toString()}`))

    make.on('close', (code) => {
      if (code === 0) resolve()
      else {
        console.error(`[node-libsamplerate:make] make exited with code ${code}`)

        process.exit(1)
      }
    })
  })

  console.log('[node-libsamplerate] make ran successfully. Welcome.')
})()
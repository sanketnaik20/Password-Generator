import { useCallback, useEffect, useState,useRef } from 'react'
import './App.css'

const DEFAULT_LENGTH = 8
const MIN_LENGTH = 8
const MAX_LENGTH = 25

function App() {
  const [length, setLength] = useState(DEFAULT_LENGTH)
  const [numberAllowed,setNumberAllowed] = useState(false)
  const [charAllowed,setCharAllowed] = useState(false)
  const [password,setPassword] = useState("")
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const passwordRef = useRef(null);

  const generatePassword= useCallback(()=>{
    let pass=""
    let str="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
    if(numberAllowed){
      str+="0123456789"
    }
    if(charAllowed){
      str+="!@#$%^&*()_+"
    }
    for(let i=0;i<length;i++){ // Changed <= to < to match length exactly
      const char = Math.floor(Math.random() * str.length) // Removed +1 to prevent out of bounds
      pass+=str.charAt(char)

    }

    setPassword(pass)
  },[length,numberAllowed,charAllowed,setPassword])

  const copyToClipboard = useCallback(() => {
    if (!password) return // Don't try to copy if password is empty
    setIsLoading(true);
    try {
      navigator.clipboard.writeText(password)
      setCopied(true)
    } catch (err) {
      console.error('Failed to copy: ', err)
      // Fallback
      if (passwordRef.current) {
        passwordRef.current.select()
        document.execCommand('copy')
        setCopied(true)
      }
    } finally {
      setIsLoading(false);
      setTimeout(() => setCopied(false), 2000)
    }
  }, [password]);


  useEffect(() => {
    generatePassword()
  }, [length, numberAllowed, charAllowed, generatePassword])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="w-full max-w-md mx-auto shadow-lg rounded-xl px-8 py-6 bg-gray-800">
        <h1 className="text-3xl font-bold text-center mb-4 text-white font-['Space_Mono']  hover:text-green-400 transition-colors duration-200">
          Password Generator
        </h1>
        <div className='flex flex-col gap-4'> {/* Reduced gap from 6 to 4 */}
          <div className='relative flex flex-col items-center'> {/* Added flex and alignment */}
            <div className='w-full relative'> {/* Wrapper for input and refresh button */}
              <input
                type="text"
                value={password}
                ref={passwordRef}
                className='w-full px-4 py-3 rounded-lg bg-gray-700 text-white text-lg 
                placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 
                shadow-sm text-center font-["Space_Mono"]'
                placeholder='Generated Password'
                readOnly
              />
              <button
                onClick={generatePassword}
                className='absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-400 
                hover:text-green-500 transition-colors duration-200'
                aria-label="Generate new password"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="rgb(34 197 94 / var(--tw-text-opacity, 1))"
                  
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
                  />
                </svg>
              </button>
            </div>
            <button 
              onClick={copyToClipboard}
              disabled={isLoading || !password}
              className='mt-4 w-[90%] px-4 py-2 text-white bg-green-600 rounded-lg 
              hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 
              transition-colors duration-200 font-["Space_Mono"] text-lg flex items-center 
              justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {isLoading ? 'Copying...' : copied ? 'Copied!' : 'Copy'}
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            </button>
          </div>
          <div className='flex flex-col gap-x-2'>
            <div className='flex items-center justify-between'>
              <label className='text-white font-["Space_Mono"]'>
                Password Length: {length}
              </label>
              <input 
                type="range" 
                min={MIN_LENGTH} 
                max={MAX_LENGTH} 
                value={length}
                onChange={(e) => {
                  const value = parseInt(e.target.value)
                  if (value >= MIN_LENGTH && value <= MAX_LENGTH) {
                    setLength(value)
                  }
                }}
                className='w-1/2 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer
                accent-green-500 hover:accent-green-600'
              />
            </div>
            <div className='flex items-center gap-4 mt-4'>
              <div className='flex items-center gap-2 relative'>
                <input
                  type="checkbox"
                  defaultChecked={numberAllowed}
                  onChange={() => setNumberAllowed((prev) => !prev)}
                  className='peer h-5 w-5 appearance-none rounded border border-gray-500 
                  bg-gray-700 checked:bg-green-600 checked:border-0 
                  transition-all duration-200 cursor-pointer
                  checked:after:content-["✦"] checked:after:absolute checked:after:left-[6px] 
                  checked:after:text-white checked:after:text-sm'
                  id="numberInput"
                />
                <label 
                  htmlFor="numberInput" 
                  className='text-white font-["Space_Mono"] cursor-pointer'
                >
                  Numbers
                </label>
              </div>
              
              <div className='flex items-center gap-2 relative'>
                <input
                  type="checkbox"
                  defaultChecked={charAllowed}
                  onChange={() => setCharAllowed((prev) => !prev)}
                  className='peer h-5 w-5 appearance-none rounded border border-gray-500 
                  bg-gray-700 checked:bg-green-600 checked:border-0 
                  transition-all duration-200 cursor-pointer
                  checked:after:content-["✦"] checked:after:absolute checked:after:left-[6px] 
                  checked:after:text-white checked:after:text-sm'
                  id="characterInput"
                />
                <label 
                  htmlFor="characterInput" 
                  className='text-white font-["Space_Mono"] cursor-pointer'
                >
                  Special Characters
                </label>
              </div>
            </div>
          </div>
        </div>

      </div>
      <div className="absolute bottom-8 text-gray-400 font-['Space_Mono'] text-sm text-center">
        <p>Made by <span className="text-green-500 hover:text-green-400 transition-colors duration-200">Sanket Naik</span></p>
        <p className="flex items-center justify-center gap-1">
          GitHub: {" "}
          <a 
            href="https://github.com/sanketnaik20" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-green-500 hover:text-green-400 transition-colors duration-200"
          >
            @sanketnaik20
          </a>
        </p>
      </div>
    </div>
  )
}

export default App


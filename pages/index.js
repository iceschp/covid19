import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Link from 'next/link'

export default function Home() {
  return (
    <div className={styles.container}>
      <h1 style={{color:"#FFFF00"}}>testtestest</h1>
      <h2><Link href="./global">global</Link></h2>
    </div>
  )
}

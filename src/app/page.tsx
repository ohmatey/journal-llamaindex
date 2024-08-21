import AskJournal from "./components/AskJournal";
import JournalFiles from "./components/JournalFiles";
import getJournalData from "./utils/getJournalData";

import styles from "./page.module.css";

const Home = async () => {
  const journalFiles = await getJournalData();

  return (
    <div className={styles.container}>
      <main>
        <h1>Ask a journal</h1>
        <p>A little assistant to help you with your journal</p>
        
        <div className={styles.askJournal}>
          <AskJournal />
        </div>

        <JournalFiles files={journalFiles} />
      </main>
    </div>
  )
}

export default Home;
import { useAppContext } from "../UniContext";
export default function MessagesView() {
  const [userData, updateUserDat] = useAppContext();
  return (
    <div>
      <p>Your messages.</p>
    </div>
  )
}

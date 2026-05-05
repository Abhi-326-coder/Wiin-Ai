const DashBoard = () => {
  return (
    <div>
      <div className="chatSection min-h-screen relative rounded flex-col justify-center items-center ">
        <div className="chatBox bg-blue-900 justify-center items-center text-center ">
          <div className="userEntry bg-amber-600 text-3xl">
              What are you Working on
          </div>
          <div className="chatArea">
            chatArea
          </div>
          <div className="responseArea">
            Response area
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashBoard

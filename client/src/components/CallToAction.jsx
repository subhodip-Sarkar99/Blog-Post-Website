

export default function CallToAction() {
  return (
    <div className="flex flex-col sm:flex-row p-3 border border-teal-500 justify-center items-center rounded-tl-3xl rounded-br-3xl text-center font-Montserrat">
        <div className="flex-1 justify-center flex flex-col">
            <h2 className="text-2xl font-semibold">Want to Know More?</h2>
            <p className="text-gray-500 my-2">
                Checkout my github @subhodip-sarkar-99
            </p>
            <a className="btn btn-active btn-accent rounded-tl-xl rounded-bl-none" href="https://github.com/subhodip-Sarkar99" target="_blank" rel="noopener noreferer"> My Projects on GitHub</a>
            </div>

        <div className="p-7 flex-1">
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRT58aurhsCLVEX0ZkxPRHqZhkja2KAiP48rA&s" alt="image" />
        </div>
    </div>
  )
}

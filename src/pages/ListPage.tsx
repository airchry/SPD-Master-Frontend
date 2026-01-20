import ListSPD from "../components/ListSPD";
import Header from "../components/Header";

function ListPage() {
    return (
    <div className="flex flex-col bg-white">
      <Header />
      <div className="w-full mx-auto py-10">
        <ListSPD />
      </div>
      
    </div>
  )
}

export default ListPage;
import { notFound } from "next/navigation"
import { SearchResultsClient } from "@/components/storefront/SearchResultsClient"

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>
}

export async function generateMetadata(props: SearchPageProps) {
  const searchParams = await props.searchParams
  const query = searchParams.q || "Search"
  return {
    title: `Search Results for "${query}"`,
    description: `Search results for ${query}`,
  }
}

export default async function SearchPage(props: SearchPageProps) {
  const searchParams = await props.searchParams
  const query = searchParams.q

  if (!query || query.trim().length === 0) {
    notFound()
  }

  return (
    <div>
      <SearchResultsClient initialQuery={query} />
    </div>
  )
}

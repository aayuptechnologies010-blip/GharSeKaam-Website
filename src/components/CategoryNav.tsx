import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { getCategories, ApiCategory } from "@/lib/api"

const CategoryNav = () => {
  const navigate = useNavigate()

  const [remoteCategories, setRemoteCategories] = useState<ApiCategory[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const ac = new AbortController()
    getCategories(ac.signal)
      .then((cats) => setRemoteCategories(cats))
      .catch((err) => {
        console.error('Failed to fetch categories', err)
        setError(err?.message || 'Failed to load categories')
        setRemoteCategories([])
      })
    return () => ac.abort()
  }, [])

  return (
    <div className="bg-background border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between overflow-x-auto">
          <div className="flex items-center gap-6 min-w-max">
            {remoteCategories === null ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="w-20 h-16 p-4 bg-gray-100 rounded-lg animate-pulse" />
              ))
            ) : remoteCategories.length === 0 ? (
              <div className="text-sm text-gray-500">No categories available</div>
            ) : (
              remoteCategories.map((category) => (
                <Button
                  key={category.id}
                  variant="ghost"
                  size="sm"
                  className="flex flex-col items-center gap-2 p-4 h-auto hover:bg-accent group"
                  onClick={() => navigate(`/category/${category.title.toLowerCase().replace(/\s+/g, '-')}`)}
                >
                  <div className={`p-2 rounded-lg bg-gray-100 group-hover:scale-110 transition-transform duration-normal`}>
                    {category.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={category.image} alt={category.title} className="h-5 w-5 object-contain" />
                    ) : (
                      <span className="h-5 w-5 block" />
                    )}
                  </div>
                  <span className="text-xs font-medium text-center whitespace-nowrap">
                    {category.title}
                  </span>
                </Button>
              ))
            )}
          </div>
        </div>
        {error && (
          <div className="text-sm text-red-600 mt-2">{error}</div>
        )}
      </div>
    </div>
  )
}

export default CategoryNav
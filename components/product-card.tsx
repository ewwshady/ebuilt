import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Product } from "@/lib/schemas"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price

  return (
    <Link href={`/products/${product.slug}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
        <div className="aspect-square relative overflow-hidden bg-muted">
          {product.images[0] ? (
            <img
              src={product.images[0] || "/placeholder.svg"}
              alt={product.name}
              className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-4xl text-muted-foreground">{product.name.charAt(0)}</span>
            </div>
          )}
          {hasDiscount && (
            <Badge className="absolute top-2 right-2 bg-destructive">
              Save {Math.round(((product.compareAtPrice! - product.price) / product.compareAtPrice!) * 100)}%
            </Badge>
          )}
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg line-clamp-2">{product.name}</h3>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{product.description}</p>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold">${product.price.toFixed(2)}</span>
            {hasDiscount && (
              <span className="text-sm text-muted-foreground line-through">${product.compareAtPrice!.toFixed(2)}</span>
            )}
          </div>
          <Badge variant="outline">{product.category}</Badge>
        </CardFooter>
      </Card>
    </Link>
  )
}

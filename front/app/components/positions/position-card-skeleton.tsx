"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function PositionCardSkeleton() {
    return (
        <Card className="overflow-hidden border shadow-sm">
            <CardContent className="p-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                        <Skeleton className="h-5 w-12" />
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-4 w-24" />
                    </div>

                    <div className="flex gap-2 ml-2">
                        <Skeleton className="h-9 w-20 rounded-full" />
                        <Skeleton className="h-9 w-20 rounded-full" />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

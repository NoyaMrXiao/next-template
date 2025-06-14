export interface Product {
    id: string
    name: string
    brand: string
    price: number
    originalPrice?: number
    volume?: string
    rating?: number
    reviewCount?: number
    imageUrl?: string
    badge?: {
        text: string
        variant: 'default' | 'secondary' | 'destructive' | 'outline'
    }
    category?: string
    description?: string
    inStock: boolean
    tags?: string[]
    isNew?: boolean
    isHot?: boolean
}

export interface CategoryItem {
    id: string
    name: string
    description: string
    imageUrl: string
    icon: string
    gradient: string
    subcategories: string[]
}

export interface HeroSectionProps {
    title: string
    description: string
    imageUrl?: string
    ctaText?: string
    ctaLink?: string
}

export interface FeatureCardProps {
    icon: React.ReactNode
    title: string
    description: string
}

export interface Category {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    icon?: string;
    gradient?: string;
    subcategories: string[];
}

export interface HeroSectionProps {
    title: string;
    description: string;
    imageUrl?: string;
    ctaText?: string;
    ctaLink?: string;
}

export interface FeatureCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
}

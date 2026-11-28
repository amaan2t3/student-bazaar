import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Heart, FileCode2, Database, FileText, ShoppingCart, PackageOpen, ArrowUpRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export const ProjectCard = ({ project }) => {
  const { toggleWishlist, isInWishlist, addToCart, isInCart } = useCart();
  const wishlisted = isInWishlist(project.id);
  const inCart = isInCart(project.id);

  return (
    <article className="group bg-white rounded-lg border border-slate-200/90 overflow-hidden shadow-subtle hover:shadow-card-hover hover:border-slate-300 transition-all duration-200 flex flex-col h-full">
      {/* Thumbnail area with restrained metadata */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100 border-b border-slate-100">
        {project.screenshots?.[0] ? (
          <img
            src={project.screenshots[0]}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300 ease-out"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-slate-400 bg-slate-50" aria-label="No project image">
            <PackageOpen className="h-9 w-9 stroke-1 text-slate-300" />
          </div>
        )}

        {/* Floating Academic Badge */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
          <span className="bg-slate-900/90 text-white text-[11px] font-semibold px-2 py-0.5 rounded shadow-xs tracking-tight">
            {project.degree} &bull; Sem {project.semester}
          </span>
          <span className="bg-white/95 text-slate-700 border border-slate-200/80 text-[10px] font-medium px-1.5 py-0.5 rounded shadow-xs">
            {project.difficulty}
          </span>
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(project.id);
          }}
          className={`absolute top-2.5 right-2.5 p-1.5 rounded-md transition-colors ${
            wishlisted 
              ? 'bg-rose-50 text-rose-600 border border-rose-200' 
              : 'bg-white/90 text-slate-500 hover:text-rose-600 hover:bg-white border border-slate-200/80 shadow-xs'
          }`}
          title={wishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
        >
          <Heart className={`w-3.5 h-3.5 ${wishlisted ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Card Content Body */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-2">
          {/* Subject & Review Rating */}
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-slate-600 bg-slate-100/90 px-2 py-0.5 rounded text-[11px] truncate max-w-[180px]">
              {project.subject}
            </span>
            <div className="flex items-center gap-1 text-amber-700 font-medium text-xs">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{project.rating?.toFixed(1) || '5.0'}</span>
              <span className="text-slate-400 font-normal">({project.reviewsCount || 0})</span>
            </div>
          </div>

          {/* Project Title */}
          <Link to={`/project/${project.slug}`} className="block group/title">
            <h3 className="font-semibold text-slate-900 text-sm leading-snug line-clamp-2 group-hover/title:text-slate-700 transition-colors">
              {project.title}
            </h3>
          </Link>

          {/* Summary */}
          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {project.summary}
          </p>

          {/* Included Deliverables Row */}
          <div className="pt-2 flex items-center gap-2 text-[11px] text-slate-500">
            <span className="inline-flex items-center gap-1 bg-slate-50 border border-slate-200/60 rounded px-1.5 py-0.5">
              <FileCode2 className="w-3 h-3 text-slate-400" /> Code
            </span>
            <span className="inline-flex items-center gap-1 bg-slate-50 border border-slate-200/60 rounded px-1.5 py-0.5">
              <Database className="w-3 h-3 text-slate-400" /> SQL
            </span>
            <span className="inline-flex items-center gap-1 bg-slate-50 border border-slate-200/60 rounded px-1.5 py-0.5">
              <FileText className="w-3 h-3 text-slate-400" /> SRS
            </span>
          </div>

          {/* Technology Pills */}
          <div className="flex flex-wrap gap-1 pt-1">
            {project.technologies?.slice(0, 3).map((tech, idx) => (
              <span key={idx} className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200/60 font-mono">
                {tech}
              </span>
            ))}
            {project.technologies?.length > 3 && (
              <span className="text-[10px] text-slate-400 font-medium self-center">
                +{project.technologies.length - 3}
              </span>
            )}
          </div>
        </div>

        {/* Card Footer: Price & Actions */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 block font-medium uppercase tracking-wider">Fixed Price</span>
            <span className="text-sm font-bold text-slate-900 tracking-tight">
              Rs. {project.pricePKR?.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => addToCart(project)}
              className={`p-1.5 rounded-md transition-colors border ${
                inCart 
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300' 
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900'
              }`}
              title={inCart ? 'In cart' : 'Add to cart'}
              aria-label={inCart ? 'Item in cart' : 'Add to cart'}
            >
              <ShoppingCart className="w-3.5 h-3.5" />
            </button>

            <Link
              to={`/project/${project.slug}`}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-xs font-medium transition-colors shadow-xs"
            >
              <span>Details</span>
              <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
};

export default ProjectCard;

<?php

namespace App\Repository;

use App\Entity\Link;
use App\Model\OrderByDto;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Link>
 */
class LinkRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Link::class);
    }

    public function findByCustom(
        array $criteria,
        ?array $orderBy = null, ?int $limit = null, ?int $offset = null
    ): array
    {
        $query = $this->createQueryBuilder('l')
            ->leftJoin('l.website', 'lw')->addSelect('lw')
        ;

        foreach ($criteria as $key => $val) {
            break;
        }

        if ($orderBy) {
            $orderBys = [];

            foreach ($orderBy as $val) {
                \array_push($orderBys, OrderByDto::parse($val));
            }

            foreach ($orderBys as $val) {
                switch ($val->name) {
                    case 'websiteDomain':
                        $val->name = 'lw.domain';
                        break;
                    case 'createdAt':
                    case 'updatedAt':
                    case 'ulid':
                    case 'relativeURL':
                        $val->name = 'l.' . $val->name;
                        break;
                    default:
                        continue 2;
                }

                switch (\strtolower($val->order ?? '')) {
                    case 'a':
                    case 'asc':
                    case 'ascending':
                        $val->order = 'ASC';
                        break;
                    case 'd':
                    case 'desc':
                    case 'descending':
                        $val->order = 'DESC';
                        break;
                    default:
                        $val->order = null;
                }

                if ($val->nulls) {
                    switch (\strtolower($val->nulls ?? '')) {
                        case 'f':
                        case 'first':
                            $val->nulls = 'DESC';
                            break;
                        case 'l':
                        case 'last':
                            $val->nulls = 'ASC';
                            break;
                        default:
                            $val->nulls = null;
                    }

                    $vname = \str_replace('.', '', $val->name);
                    $vselc = '(CASE WHEN ' . $val->name . ' IS NULL THEN 1 ELSE 0 END) AS HIDDEN ' . $vname;

                    $query->addSelect($vselc);
                    $query->addOrderBy($vname, $val->nulls);
                }

                $query->addOrderBy($val->name, $val->order);
            }
        } else {
            $query->orderBy('l.ulid');
        }

        $query->setMaxResults($limit);
        $query->setFirstResult($offset);

        return $query->getQuery()->getResult();
    }

    public function countCustom(array $criteria = []): int
    {
        $query = $this->createQueryBuilder('l')
            ->select('count(l.id)')
        ;

        foreach ($criteria as $key => $val) {
            break;
        }

        return $query->getQuery()->getSingleScalarResult();
    }
}
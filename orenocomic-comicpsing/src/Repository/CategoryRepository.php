<?php

namespace App\Repository;

use App\Entity\Category;
use App\Model\OrderByDto;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\QueryBuilder;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Category>
 */
class CategoryRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Category::class);
    }

    public function findByCustom(
        array $criteria,
        ?array $orderBy = null, ?int $limit = null, ?int $offset = null
    ): array
    {
        $query = $this->createQueryBuilder('c')
            ->leftJoin('c.type', 'ct')->addSelect('ct')
        ;

        $q1 = false;
        $q1Func = function(bool &$c, QueryBuilder &$q): void {
            if ($c) return;
            $q->leftJoin('c.parent', 'cp');
            $c = true;
        };

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
                    case 'typeCode':
                        $val->name = 'ct.code';
                        break;
                    case 'parentCode':
                        $q1Func($q1, $query);
                        $val->name = 'cp.code';
                        break;
                    case 'createdAt':
                    case 'updatedAt':
                    case 'code':
                    case 'name':
                        $val->name = 'cl.' . $val->name;
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
            $query->orderBy('ct.type');
            $query->orderBy('c.code');
        }

        $query->setMaxResults($limit);
        $query->setFirstResult($offset);

        return $query->getQuery()->getResult();
    }

    public function countCustom(array $criteria = []): int
    {
        $query = $this->createQueryBuilder('c')
            ->select('count(c.id)')
        ;

        foreach ($criteria as $key => $val) {
            break;
        }

        return $query->getQuery()->getSingleScalarResult();
    }
}
